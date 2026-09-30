import React from 'react'
import { Award } from 'lucide-react'
import CertificatePage from './CertificatePage'

const ATLSCertificate = () => (
    <CertificatePage
        icon={Award}
        abbreviation="ATLS"
        title="Advanced Trauma Life Support"
        issuer="American College of Surgeons (ACS)"
        issueDate="2024"
        expirationDate="2028"
        image="/pictures/ATLS.jpg"
        description="Advanced Trauma Life Support (ATLS) is a training program for medical providers in the management of acute trauma cases. It teaches a systematic, concise approach to trauma care, focusing on rapid assessment and treatment of life-threatening injuries within the first hour after injury."
        skills={[
            'Primary and secondary trauma assessment',
            'Airway management and breathing support',
            'Shock recognition and management',
            'Trauma team leadership and coordination',
        ]}
    />
)

export default ATLSCertificate
