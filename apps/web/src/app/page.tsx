import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>
            azilseniori.ro
          </Link>
          <nav className={styles.nav}>
            <Link href="/caut">Caut un cămin</Link>
            <Link href="/pentru-camine">Pentru cămine</Link>
            <Link href="/autentificare" className={styles.linkMuted}>
              Autentificare
            </Link>
            <Link href="/inscrie-camin" className={styles.ctaOwner}>
              Înscrie un cămin
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Platformă premium pentru familii</p>
            <h1>Găsește un cămin potrivit, verifică informațiile și contactează centrul în siguranță.</h1>
            <p className={styles.lead}>
              azilseniori.ro te ajută să descoperi cămine pentru seniori din România, cu
              informații verificate și solicitări transparente.
            </p>
            <div className={styles.heroActions}>
              <Link href="/caut" className={styles.ctaPrimary}>
                Caut un cămin
              </Link>
              <Link href="/inscrie-camin" className={styles.ctaSecondary}>
                Înscrie un cămin
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={`container ${styles.featureGrid}`}>
            <article className={styles.card}>
              <h2>Informații clare</h2>
              <p>Profiluri detaliate, facilități, disponibilitate și recenzii moderate.</p>
            </article>
            <article className={styles.card}>
              <h2>Contact în siguranță</h2>
              <p>Solicitări cu timeline complet și comunicare transparentă cu căminele.</p>
            </article>
            <article className={styles.card}>
              <h2>Administrare pentru proprietari</h2>
              <p>Dashboard pentru cămine, solicitări, programări și documente.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} azilseniori.ro · Faza 1 bootstrap</p>
        </div>
      </footer>
    </div>
  );
}
