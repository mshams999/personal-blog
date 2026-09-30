import React from 'react'
import { Heart } from 'lucide-react'
import CertificatePage from './CertificatePage'

const ACLSCertificate = () => (
    <CertificatePage
        icon={Heart}
        abbreviation="ACLS"
        title="Advanced Cardiac Life Support"
        issuer="American Heart Association (AHA)"
        issueDate="August 29, 2025"
        expirationDate="August 2027"
        expirationLabel="Renew by"
        image="/pictures/certificates/acls-2025.png"
        descriptionHeading="Course completion"
        description="Successfully completed the cognitive and skills evaluations in accordance with the American Heart Association Advanced Cardiovascular Life Support (ACLS) program."
        extraDetails={[
            { label: 'Training center', value: 'Canadian Medical Training Center' },
            { label: 'Training center ID', value: 'ZZ21672' },
            { label: 'Location', value: 'Dammam, Eastern Region, Saudi Arabia' },
            { label: 'eCard code', value: '265625103270' },
        ]}
        skills={[
            'Advanced airway management',
            'ECG rhythm recognition and interpretation',
            'Pharmacology for cardiovascular emergencies',
            'Team dynamics and effective communication',
            'Post-cardiac arrest care',
        ]}
    />
)

export default ACLSCertificate
