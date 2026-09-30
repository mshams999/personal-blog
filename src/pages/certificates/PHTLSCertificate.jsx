import React from 'react'
import { Activity } from 'lucide-react'
import CertificatePage from './CertificatePage'

const PHTLSCertificate = () => (
    <CertificatePage
        icon={Activity}
        abbreviation="PHTLS"
        title="Prehospital Trauma Life Support"
        issuer="National Association of Emergency Medical Technicians (NAEMT)"
        issuerLabel="Issuing organization"
        issueDate="August 31 – September 1, 2025"
        expirationDate="September 2029"
        image="/pictures/certificates/phtls-certificate.png"
        images={[
            {
                src: '/pictures/certificates/phtls-certificate.png',
                alt: 'NAEMT Prehospital Trauma Life Support 10th Edition Provider certificate',
                label: 'Course certificate',
            },
            {
                src: '/pictures/certificates/phtls-card.png',
                alt: 'PHTLS completion letter and wallet card',
                label: 'Completion letter & wallet card',
            },
        ]}
        descriptionHeading="Course completion"
        description="Completed NAEMT’s 10th Edition Provider course in Prehospital Trauma Life Support, conducted by Canadian Medical Center. The course recognizes a commitment to improving patient care through high-quality, evidence-based education."
        extraDetails={[
            { label: 'Training center', value: 'Canadian Medical Center' },
            { label: 'Course number', value: 'PH-25-15725-00' },
            { label: 'Participation ID', value: '6D908194-1B8A-AE48-9C68-D3E394FA88E9' },
        ]}
    />
)

export default PHTLSCertificate
