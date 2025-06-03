// pages/_app.js
import Layout from '../components/Layout';
import '../styles/globals.css';
import AOS from 'aos'; // 导入 AOS
import 'aos/dist/aos.css'; // 导入 AOS 的 CSS 样式
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        AOS.init({
            duration: 1000, // 动画持续时间 (ms)
            offset: 100,    // 元素距离视口底部多少像素时触发动画
            once: false,    // 动画是否只播放一次 (true 表示只播放一次)
            mirror: false,  // 元素滚出视口时是否反向播放动画
            easing: 'ease-out-cubic', // 动画缓动函数
        });
    }, []); // 空依赖数组确保只在应用加载时初始化一次

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;