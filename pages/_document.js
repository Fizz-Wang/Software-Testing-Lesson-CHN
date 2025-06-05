// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
    return (
        <Html lang={props.__NEXT_DATA__?.locale || 'zh'}> {/* 使用可选链 ?. */}
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" /> {/* <<< 确保有这一行 */}
                {/* 您其他的 meta 标签或链接 */}
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}