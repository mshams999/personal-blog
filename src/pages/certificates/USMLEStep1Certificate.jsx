import React from 'react'
import { GraduationCap } from 'lucide-react'
import CertificatePage from './CertificatePage'

const USMLEStep1Certificate = () => (
    <CertificatePage
        icon={GraduationCap}
        abbreviation="USMLE Step 1"
        title="United States Medical Licensing Examination"
        issuer="USMLE Step 1"
        issuerLabel="Examination"
        issueDate="February 2025"
        image="/pictures/step1.jpg"
        descriptionHeading="About USMLE Step 1"
        description="USMLE Step 1 assesses whether medical students and graduates understand and can apply important concepts of the basic sciences to the practice of medicine. Passing Step 1 is a major milestone in the US medical licensing pathway."
        skillsHeading="Knowledge areas assessed"
        skills={[
            'Anatomy and cell biology',
            'Biochemistry and molecular biology',
            'Microbiology and immunology',
            'Pathology and pathophysiology',
            'Pharmacology and therapeutics',
            'Physiology and biophysics',
        ]}
        extraDetails={[
            { label: 'Exam authority', value: 'National Board of Medical Examiners (NBME)' },
            { label: 'Result', value: 'Passed' },
        ]}
    />
)

export default USMLEStep1Certificate
