import { TinaCMS } from "tinacms"

// This page will be accessible at /admin
export default function Admin() {
    return <TinaCMS />
}

// This is required for the admin route to work
export async function getStaticProps() {
    return {
        props: {},
    }
}
