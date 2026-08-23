import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Stethoscope,
  ShieldCheck,
  Pill,
  Bell,
  BarChart3,
  ArrowRight,
  UserCheck,
  ClipboardList,
  Activity
} from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  const [stats, setStats] = React.useState({ complianceRate: 98 });

  React.useEffect(() => {
    fetch('http://localhost:8080/api/auth/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.complianceRate === 'number') {
          setStats(data);
        }
      })
      .catch(() => { });
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-foreground flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold text-gradient tracking-tight">FARMTRACE</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-primary transition-colors">{t('landing.nav.features', 'Features')}</a>
            <a href="#roles" onClick={(e) => handleScrollTo(e, 'roles')} className="hover:text-primary transition-colors">{t('landing.nav.workflows', 'Roles & Workflows')}</a>
            <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="hover:text-primary transition-colors">{t('landing.nav.security', 'Security & Standards')}</a>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button asChild className="btn-gradient-primary shadow-sm hover:shadow-md transition-all">
                <Link to="/dashboard" className="flex items-center">
                  {t('landing.nav.dashboard', 'Go to Dashboard')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="btn-gradient-primary shadow-sm hover:shadow-md transition-all">
                <Link to="/login">{t('landing.nav.signIn', 'Sign In')}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow py-12 md:py-24 flex items-center relative overflow-hidden">
        {/* Modern background blur effects */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm transition-all duration-300 hover:bg-primary/15 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" /> {t('landing.hero.secured', 'Secured with Spring Security & JWT')}
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gradient tracking-tight leading-tight">
                {t('landing.hero.title', 'Collaborative Farm Management with Veterinary Tracking and Compliance Portal')}
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t('landing.hero.description', 'A secure unified space for farmers, veterinary doctors, and regulatory officers to log cattle illnesses, track treatment logs, verify antibiotic withdrawal periods, and maintain absolute food safety compliance.')}
              </p>

              <div className="flex flex-col sm:flex-row justify-start items-center gap-4 pt-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="btn-gradient-primary px-8 py-6 text-base font-semibold shadow-md hover:scale-105 transition-transform duration-200 w-full sm:w-auto">
                    <Link to="/dashboard" className="flex items-center justify-center">
                      {t('landing.hero.accessDashboard', 'Access Dashboard')}
                      <ArrowRight className="w-5 h-5 ml-2.5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="btn-gradient-primary px-8 py-6 text-base font-semibold shadow-md hover:scale-105 transition-transform duration-200 w-full sm:w-auto">
                      <Link to="/login" className="justify-center">{t('landing.hero.getStarted', 'Get Started Now')}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted/50 px-8 py-6 text-base font-medium w-full sm:w-auto">
                      <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="justify-center">{t('landing.hero.exploreFeatures', 'Explore Features')}</a>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Visual Dashboard / Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-card/30 backdrop-blur-md p-2 group hover:border-primary/30 transition-all duration-500">
                <img
                  src="/images/natural_farm.jpg"
                  alt="Smart Farm Portal"
                  className="rounded-xl w-full object-cover aspect-video lg:aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none rounded-xl" />

                {/* Float Badge 1 */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Compliance Rate</p>
                      <p className="text-sm font-bold text-foreground">{stats.complianceRate}% Active</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="status-success text-xs font-semibold px-2.5 py-0.5">Live Audits</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implemented Features Grid */}
      <section id="features" className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('landing.features.title', 'Core Ecosystem Features')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('landing.features.subtitle', 'A comprehensive set of features specifically built to coordinate treatment timelines and prevent antibiotic residues from reaching the supply chain.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.health.title', 'Cattle Health Reporting')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.health.desc', 'Allows farmers to quickly report cattle sickness logs, tag individual cattle IDs, select visual symptom profiles, and set urgency classifications.')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.prescription.title', 'Smart Prescription Issuance')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.prescription.desc', 'Veterinarians can diagnose cases and prescribe medications. Auto-calculates withdrawal period requirements (for milk and meat) using an embedded Antimicrobial Use (AMU) reference database.')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.alerts.title', 'Withdrawal Alerts & Notifications')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.alerts.desc', 'Triggers automated countdown alerts mapping the withdrawal timelines. Notifies farmers of exactly when products from treated cattle are safe to release for consumption.')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.feed.title', 'Feed Additives Tracking')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.feed.desc', 'Farmers can document feed additives and nutrition programs, ensuring all substances fed to livestock comply with food security guidelines and organic certification standards.')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.compliance.title', 'Compliance Analytics & Audits')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.compliance.desc', 'Regulatory officers get dynamic analytics, compliance dashboards, and audit capabilities to analyze antibiotic usage metrics and verify safety thresholds across regions.')}
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-border/50 bg-background/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('landing.features.security.title', 'Role-Based Security')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('landing.features.security.desc', 'Strong backend isolation with Spring Security. Role-based permissions guard endpoints for Farmers, Veterinarians, and Regulatory officers authenticated via JWT.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Workflows */}
      <section id="roles" className="py-20 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('landing.roles.title', 'Tailored Workflows')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('landing.roles.subtitle', 'FarmTrace fits into your standard operations, providing specialized tools for each actor in the livestock supply chain.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmers Card */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img src="/images/natural_farm.jpg" alt="Farmer Workflow" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  <Badge variant="outline" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border-border">{t('landing.roles.farmers.badge', 'FARMERS')}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{t('landing.roles.farmers.title', 'Log Health & Feed')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('landing.roles.farmers.desc', 'Log sickness issues, record feed additive formulations, track active withdrawal periods, and receive real-time warnings to make sure non-compliant milk or meat is not commercialized.')}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center space-x-2 text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors">
                <span>{t('landing.roles.farmers.link', 'View Dashboard')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Veterinarians Card */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img src="/images/vet_check.jpg" alt="Veterinarian Workflow" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  <Badge variant="outline" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border-border">{t('landing.roles.vets.badge', 'VETERINARIANS')}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{t('landing.roles.vets.title', 'Review Cases & Prescribe')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('landing.roles.vets.desc', 'Review reported cattle symptoms, initiate case assessments, issue verified digital prescriptions, and define safe withdrawal limits using international drug compliance rules.')}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center space-x-2 text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors">
                <span>{t('landing.roles.vets.link', 'Issue Prescription')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Regulators Card */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img src="/images/regulator_analytics.jpg" alt="Regulator Workflow" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  <Badge variant="outline" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border-border">{t('landing.roles.regulators.badge', 'REGULATORS')}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{t('landing.roles.regulators.title', 'Audit Compliance & Usage')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('landing.roles.regulators.desc', 'Audit regional cattle health logs, inspect treatment compliance metrics, analyze total antimicrobial use indices, and export detailed reporting sheets for supply chain checks.')}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 flex items-center space-x-2 text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors">
                <span>{t('landing.roles.regulators.link', 'Analyze Metrics')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Standards Section */}
      <section id="about" className="py-24 bg-muted/40 border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" /> {t('landing.security.badge', 'Security First')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('landing.security.title', 'Enterprise Security & Compliance Standards')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              {t('landing.security.subtitle', 'FarmTrace is built on a modern, secure, and fully audited framework designed to meet national food safety guidelines and regulatory standards.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side: Key security pillars */}
            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-background border border-border hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t('landing.security.spring.title', 'Spring Security & JWT Backend')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.security.spring.desc', 'All REST API endpoints are guarded by a robust Spring Security layer. Authentication uses stateless JSON Web Tokens (JWT) for secure session management and tamper-proof payloads.')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-background border border-border hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t('landing.security.rbac.title', 'Granular Role-Based Access Control (RBAC)')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.security.rbac.desc', 'Strict isolation of data and capabilities. Farmers manage sickness logs, veterinary doctors authorize treatments, and regulatory officers access compliance metrics.')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-background border border-border hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t('landing.security.amu.title', 'Antimicrobial Use (AMU) Regulations')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('landing.security.amu.desc', 'Strict adherence to withdrawal period enforcement rules. Automatically locks veterinary treatment records until safety thresholds are certified, protecting the public supply chain.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Security Flow Visualized */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border/80 relative shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> {t('landing.security.flow.title', 'Active Protection Flow')}
              </h3>

              <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {/* Step 1 */}
                <div className="flex gap-4 relative">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 shrink-0">
                    <span className="text-xs font-bold text-primary">01</span>
                  </div>
                  <div className="pt-1.5">
                    <h4 className="text-sm font-semibold">{t('landing.security.flow.step1.title', 'Stateless JWT Authentication')}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('landing.security.flow.step1.desc', 'User signs in, receives cryptographic token valid for active sessions.')}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 shrink-0">
                    <span className="text-xs font-bold text-primary">02</span>
                  </div>
                  <div className="pt-1.5">
                    <h4 className="text-sm font-semibold">{t('landing.security.flow.step2.title', 'Spring Boot Route Guardian')}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('landing.security.flow.step2.desc', 'Filter chain intercepts every request, verifying the JWT validity and checking role credentials.')}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 shrink-0">
                    <span className="text-xs font-bold text-primary">03</span>
                  </div>
                  <div className="pt-1.5">
                    <h4 className="text-sm font-semibold">{t('landing.security.flow.step3.title', 'Traceability & Withdrawal Enforcement')}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('landing.security.flow.step3.desc', 'Database logs are verified automatically against target food safety standards.')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="font-bold tracking-tight">FARMTRACE</span>
          </div>
          <p>© {new Date().getFullYear()} {t('landing.footer.rights', 'FarmTrace. All rights reserved.')}</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors">{t('landing.footer.privacy', 'Privacy Policy')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('landing.footer.terms', 'Terms of Service')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Supporting Badge component locally if not imported
const Badge = ({ children, className, variant = 'default', ...props }) => {
  const variantStyles = variant === 'outline'
    ? 'border border-border text-foreground hover:bg-muted/50'
    : 'bg-primary text-primary-foreground';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Landing;
