import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    
                    {/* COLUMNA 1: LOGO Y FRASE */}
                    <div style={styles.column}>
                        <img src="/img/logo.png" alt="BeanQuick Logo" style={styles.logo} />
                        <p style={styles.description}>
                            Conectando el aroma de los mejores cafés locales con tu tiempo. 
                            Reserva, llega y disfruta.
                        </p>
                        <div style={styles.socials}>
                            <a href="#" style={styles.socialIcon}><FaFacebook /></a>
                            <a href="#" style={styles.socialIcon}><FaInstagram /></a>
                            <a href="#" style={styles.socialIcon}><FaTwitter /></a>
                        </div>
                    </div>

                    {/* COLUMNA 3: CONTACTO */}
                    <div style={styles.column}>
                        <h4 style={styles.title}>Contacto</h4>
                        <ul style={styles.list}>
                            <li style={styles.contactItem}><FaMapMarkerAlt /> Medellín, Colombia</li>
                            <li style={styles.contactItem}><FaPhone /> +57 300 000 0000</li>
                            <li style={styles.contactItem}><FaEnvelope /> soporte@beanquick.com</li>
                        </ul>
                    </div>

                </div>

                <div style={styles.bottomBar}>
                    <p>© 2026 BeanQuick. Todos los derechos reservados. Desarrollado con ❤️ para los Coffee Lovers.</p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#261815', // Café muy oscuro
        color: '#fff',
        padding: '60px 0 20px 0',
        marginTop: 'auto'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    logo: {
        width: '140px',
        marginBottom: '20px'
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#d7ccc8', // Tono beige suave
        marginBottom: '20px'
    },
    title: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#e0c3a2' // Dorado/Café claro
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    link: {
        color: '#d7ccc8',
        textDecoration: 'none',
        fontSize: '14px',
        marginBottom: '10px',
        display: 'block',
        transition: 'color 0.3s',
        cursor: 'pointer'
    },
    socials: {
        display: 'flex',
        gap: '15px'
    },
    socialIcon: {
        color: '#fff',
        fontSize: '20px',
        transition: 'color 0.3s'
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#d7ccc8',
        marginBottom: '12px'
    },
    bottomBar: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#a1887f'
    }
};

export default Footer;