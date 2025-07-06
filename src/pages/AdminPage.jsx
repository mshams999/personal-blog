import React from 'react'
import { TinaCMS } from 'tinacms'

/**
 * Admin Page Component for TinaCMS
 * This page provides the visual CMS interface at /admin
 */
const AdminPage = () => {
    return (
        <div className="min-h-screen">
            <TinaCMS />
        </div>
    )
}

export default AdminPage
