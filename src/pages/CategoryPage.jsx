import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useHybridData } from '../contexts/HybridDataContext'

const CategoryPage = () => {
    const { categorySlug } = useParams()
    const { getCategoryBySlug } = useHybridData()

    const category = getCategoryBySlug(categorySlug)

    if (!category) return <Navigate to="/blog" replace />

    return <Navigate to={`/blog?category=${encodeURIComponent(category.id)}`} replace />
}

export default CategoryPage
