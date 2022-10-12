import { Layout } from "@app/components/layout"
import Head from "next/head"


const AboutPage = () => {
    return (
        <>
            <Head>
                <title>Pineso</title>
                <meta property="og:url" content="https://pineso.io" />
                <meta property="og:title" content="Pineso" />
                <meta property="og:description" content="Build with Deso Blockchain" />
                <meta property="og:image" content="https://pineso.io/images/icon-512x512.png" />
            </Head>
            <Layout>
                <h1>Page</h1>
                <p>Coming Soon...</p>
            </Layout>
        </>
    )
}

export default AboutPage