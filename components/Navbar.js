// components/Navbar.js
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navLinks}>
                <li><Link href="/">首页</Link></li>
                <li className={styles.dropdownContainer}>
                    {/* 将 Link 改为 span，并应用样式使其看起来像链接 */}
                    <span className={`${styles.navLinkText} ${styles.navLinkLookalike}`}>学习资料</span>
                    <ul className={styles.dropdownMenu}>
                        <li><Link href="/study-materials/basic-testing/what-is-testing">基础测试</Link></li>
                        <li><Link href="/study-materials/automated-testing/TBD">自动化测试</Link></li>
                        {/* ... 其他下拉项 ... */}
                    </ul>
                </li>
                <li><Link href="/interview-questions">面试题</Link></li>
            </ul>
        </nav>
    );

}