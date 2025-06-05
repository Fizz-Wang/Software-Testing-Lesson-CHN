// components/Layout.js
import Navbar from './Navbar'; // Navbar 组件现在主要用于移动端展开的菜单内容
import styles from '../styles/Layout.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children, pageTitle = "软件测试学习平台" }) {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 新增状态：控制移动菜单显隐

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
            const formattedDate = now.toLocaleDateString('zh-CN', dateOptions);
            const formattedTime = now.toLocaleTimeString('zh-CN', timeOptions);
            setCurrentDateTime(`${formattedDate} ${formattedTime}`);
        };
        updateDateTime();
        const timerId = setInterval(updateDateTime, 60000);
        return () => clearInterval(timerId);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content="一个用于学习软件测试和准备面试的平台" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" /> {/* 确保 viewport meta 存在 */}
            </Head>

            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    <div className={styles.headerContentWrapper}> {/* 这个 wrapper 在桌面和移动端都用于限制最大宽度和居中 */}

                        {/* 桌面导航栏容器 (移动端隐藏) */}
                        <div className={styles.desktopNavbarContainer}>
                            <div className={styles.siteTitleContainer}>
                                <Link href="/" legacyBehavior>
                                    <a className={styles.siteTitleLink}>
                                        <h1 className={styles.siteTitle}>软件测试学习平台</h1>
                                    </a>
                                </Link>
                            </div>
                            <div className={styles.navbarPlacement}> {/* 用于放置桌面导航 */}
                                <Navbar />
                            </div>
                            <div className={styles.currentDateTimeDesktop}>
                                {currentDateTime}
                            </div>
                        </div>

                        {/* 移动端页眉 (仅在移动端显示) */}
                        <div className={styles.mobileHeaderContainer}>
                            <div className={styles.siteTitleContainerMobile}>
                                <Link href="/" legacyBehavior>
                                    <a className={styles.siteTitleLink}>
                                        <h1 className={styles.siteTitleMobile}>软件测试学习平台</h1>
                                    </a>
                                </Link>
                            </div>
                            <button className={styles.hamburgerButton} onClick={toggleMobileMenu} aria-label="Toggle navigation" aria-expanded={isMobileMenuOpen}>
                                {/* 简单的汉堡包图标 (三条横线) */}
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>

                    {/* 移动端展开的菜单 */}
                    {isMobileMenuOpen && (
                        <div className={styles.mobileMenu}>
                            <Navbar /> {/* Navbar 组件的链接会在移动端菜单中垂直排列 */}
                            <div className={styles.currentDateTimeMobileMenu}> {/* 日期时间放在移动菜单底部 */}
                                {currentDateTime}
                            </div>
                        </div>
                    )}
                </header>

                {/* main 和 footer 保持不变 */}
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