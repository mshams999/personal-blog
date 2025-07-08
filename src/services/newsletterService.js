import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore'
import { db } from '../config/firebase'
import emailService from './emailService'

/**
 * Firestore Newsletter Service
 * Manages newsletter subscriptions in Firestore
 */
class NewsletterService {
    constructor() {
        this.collectionName = 'newsletter_subscribers'
    }

    /**
     * Subscribe a user to the newsletter
     * @param {string} email - User's email address
     * @param {string} firstName - User's first name (optional)
     * @returns {Promise<Object>} Subscription result
     */
    async subscribe(email, firstName = '') {
        try {
            // Check if email already exists
            const existingSubscriber = await this.getSubscriberByEmail(email)

            if (existingSubscriber) {
                return {
                    success: false,
                    error: 'This email is already subscribed to our newsletter.',
                    code: 'ALREADY_SUBSCRIBED'
                }
            }

            // Create new subscriber
            const subscriberData = {
                email: email.toLowerCase().trim(),
                firstName: firstName.trim(),
                subscribedAt: Timestamp.now(),
                isActive: true,
                source: 'website',
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent,
                preferences: {
                    weeklyUpdate: true,
                    newPosts: true,
                    specialOffers: false
                }
            }

            const docRef = await addDoc(collection(db, this.collectionName), subscriberData)

            // Send welcome email automatically
            try {
                const emailResult = await emailService.sendWelcomeEmail(email, firstName)
                console.log('Welcome email result:', emailResult)
            } catch (emailError) {
                // Don't fail the subscription if email fails
                console.log('Welcome email failed (non-critical):', emailError)
            }

            return {
                success: true,
                subscriberId: docRef.id,
                message: 'Successfully subscribed to newsletter!'
            }

        } catch (error) {
            console.error('Newsletter subscription error:', error)
            return {
                success: false,
                error: 'Failed to subscribe. Please try again.',
                code: 'SUBSCRIPTION_ERROR'
            }
        }
    }

    /**
     * Get subscriber by email
     * @param {string} email - Email to search for
     * @returns {Promise<Object|null>} Subscriber data or null
     */
    async getSubscriberByEmail(email) {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('email', '==', email.toLowerCase().trim())
            )

            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]
                return {
                    id: doc.id,
                    ...doc.data()
                }
            }

            return null
        } catch (error) {
            console.error('Error getting subscriber:', error)
            return null
        }
    }

    /**
     * Get all active subscribers
     * @returns {Promise<Array>} Array of active subscribers
     */
    async getAllSubscribers() {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('isActive', '==', true),
                orderBy('subscribedAt', 'desc')
            )

            const querySnapshot = await getDocs(q)

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error getting subscribers:', error)
            return []
        }
    }

    /**
     * Unsubscribe a user
     * @param {string} email - Email to unsubscribe
     * @returns {Promise<Object>} Unsubscribe result
     */
    async unsubscribe(email) {
        try {
            const subscriber = await this.getSubscriberByEmail(email)

            if (!subscriber) {
                return {
                    success: false,
                    error: 'Email not found in our newsletter list.',
                    code: 'NOT_FOUND'
                }
            }

            // Update subscriber to inactive instead of deleting
            const subscriberRef = doc(db, this.collectionName, subscriber.id)
            await updateDoc(subscriberRef, {
                isActive: false,
                unsubscribedAt: Timestamp.now()
            })

            return {
                success: true,
                message: 'Successfully unsubscribed from newsletter.'
            }

        } catch (error) {
            console.error('Unsubscribe error:', error)
            return {
                success: false,
                error: 'Failed to unsubscribe. Please try again.',
                code: 'UNSUBSCRIBE_ERROR'
            }
        }
    }

    /**
     * Get newsletter statistics
     * @returns {Promise<Object>} Newsletter stats
     */
    async getStats() {
        try {
            const subscribers = await this.getAllSubscribers()

            // Get subscription trends (last 30 days)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const recentSubscribers = subscribers.filter(sub =>
                sub.subscribedAt.toDate() > thirtyDaysAgo
            )

            return {
                totalActiveSubscribers: subscribers.length,
                recentSubscriptions: recentSubscribers.length,
                growthRate: subscribers.length > 0 ?
                    (recentSubscribers.length / subscribers.length * 100).toFixed(1) : 0,
                lastUpdated: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error getting stats:', error)
            return {
                totalActiveSubscribers: 0,
                recentSubscriptions: 0,
                growthRate: 0,
                lastUpdated: new Date().toISOString()
            }
        }
    }

    /**
     * Get client IP address (for analytics)
     * @returns {Promise<string>} IP address
     */
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return data.ip
        } catch (error) {
            return 'unknown'
        }
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Send welcome email to subscriber
     * @param {string} email - Subscriber email
     * @param {string} firstName - Subscriber first name
     * @returns {Promise<Object>} Email result
     */
    async sendWelcomeEmail(email, firstName = '') {
        return await emailService.sendWelcomeEmail(email, firstName)
    }

    /**
     * Get email service status
     * @returns {Object} Email service configuration status
     */
    getEmailServiceStatus() {
        return emailService.getServiceStatus()
    }
}

export default new NewsletterService()
