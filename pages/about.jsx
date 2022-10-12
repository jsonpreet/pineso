import { Layout } from "@app/components/layout"
import { BASE_URL } from "@app/lib/constants"
import Head from "next/head"


const AboutPage = () => {
    return (
        <>
            <Head>
                <title>Pineso</title>
                <meta property="og:url" content={BASE_URL} />
                <meta property="og:title" content="Pineso" />
                <meta property="og:description" content="Build with Deso Blockchain" />
                <meta property="og:image" content={`${BASE_URL}/images/icons/icon-512x512.png`} />
            </Head>
            <Layout>
                <h1>Page</h1>
                <p>Coming Soon...</p>
            </Layout>
        </>
    )
}

export default AboutPage