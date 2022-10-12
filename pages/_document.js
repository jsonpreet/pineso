import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage

        // Run the React rendering logic synchronously
        ctx.renderPage = () =>
            originalRenderPage({
            // Useful for wrapping the whole react tree
            enhanceApp: (App) => App,
            // Useful for wrapping in a per-page basis
            enhanceComponent: (Component) => Component,
            })

        // Run the parent `getInitialProps`, it now includes the custom `renderPage`
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="robots" content="index, follow" />
                    <meta name="description" content="Build with Deso Blockchain" />
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@pinesoio" />
                    <meta name="twitter:creator" content="@pinesoio" />
                    <meta property="og:url" content="https://pineso.io" />
                    <meta property="og:title" content="Pineso" />
                    <meta property="og:description" content="Build with Deso Blockchain" />
                    <meta property="og:image" content="https://pineso.io/images/og-image.png" />
                    <meta property="og:image:alt" content="Pineso" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:site_name" content="Pineso" />
                    <meta property="og:type" content="website" />
                    <meta property="og:locale" content="en_US" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" /> 
                    {CssBaseline.flush()}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
export default MyDocument;