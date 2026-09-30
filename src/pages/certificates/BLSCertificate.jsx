import React from 'react'
import { HeartHandshake } from 'lucide-react'
import CertificatePage from './CertificatePage'

const BLSCertificate = () => (
    <CertificatePage
        icon={HeartHandshake}
        abbreviation="BLS"
        title="Basic Life Support"
        issuer="American Heart Association (AHA)"
        issueDate="August 28, 2025"
        expirationDate="August 2027"
        expirationLabel="Renew by"
        image="/pictures/certificates/bls-2025.png"
        descriptionHeading="Course completion"
        description="Successfully completed the cognitive and skills evaluations in accordance with the American Heart Association Basic Life Support (CPR and AED) program."
        extraDetails={[
            { label: 'Training center', value: 'Canadian Medical Training Center' },
            { label: 'Training center ID', value: 'ZZ21672' },
            { label: 'Location', value: 'Dammam, Eastern Region, Saudi Arabia' },
            { label: 'eCard code', value: '265605102763' },
        ]}
        skills={[
            'High-quality CPR for adults, children, and infants',
            'AED (Automated External Defibrillator) use',
            'Relief of choking in responsive victims',
            'Effective team communication and dynamics',
            'Recognition of cardiac arrest and breathing emergencies',
        ]}
    />
)

export default BLSCertificate
