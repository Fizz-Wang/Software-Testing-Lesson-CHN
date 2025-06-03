// components/Layout.js
import Navbar from './Navbar';
import styles from '../styles/Layout.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children, pageTitle = "软件测试学习平台" }) {
    const [currentDateTime, setCurrentDateTime] = useState(''); // 重命名状态变量

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            };
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                // second: '2-digit', // 如果需要秒，取消注释
                hour12: false // 使用24小时制
            };
            const formattedDate = now.toLocaleDateString('zh-CN', dateOptions);
            const formattedTime = now.toLocaleTimeString('zh-CN', timeOptions);
            setCurrentDateTime(`${formattedDate} ${formattedTime}`);
        };

        updateDateTime(); // 初始加载时设置一次
        const timerId = setInterval(updateDateTime, 60000); // 每分钟更新一次时间 (可选)

        return () => clearInterval(timerId); // 清理 interval
    }, []);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content="一个用于学习软件测试和准备面试的平台" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    {/* headerContentWrapper 现在是单行flex布局的容器 */}
                    <div className={styles.headerContentWrapper}>
                        {/* 左侧：站点标题 */}
                        <div className={styles.siteTitleContainer}>
                            <Link href="/" legacyBehavior>
                                <a className={styles.siteTitleLink}>
                                    <h1 className={styles.siteTitle}>软件测试学习平台</h1>
                                </a>
                            </Link>
                        </div>

                        {/* 中间：导航栏 */}
                        <div className={styles.navbarContainer}>
                            <Navbar />
                        </div>

                        {/* 右侧：日期和时间 */}
                        <div className={styles.currentDateTime}>
                            {currentDateTime}
                        </div>
                    </div>
                </header>

                <main className={styles.mainContent}>
                    <div className={styles.mainContentInner}>
                        {children}
                    </div>
                </main>

                <footer className={styles.footer}>
                    <div className={styles.footerContentWrapper}>
                        <p>页脚内容待定 © {new Date().getFullYear()} 软件测试学习平台</p>
                    </div>
                </footer>
            </div>
        </>
    );
}