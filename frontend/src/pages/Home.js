import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className={styles['home-page']}>
      {/* Hero Section */}
      <Hero
        title="Stop Swiping. Start Connecting."
        subtitle="Meet people based on who you actually are—not just what you look like. Affinity uses personality compatibility science to find your true match."
        cta1Text="Find Your Match"
        cta1Link="/register"
        cta2Text="Already have an account?"
        cta2Link="/login"
        backgroundImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop"
      />

      {/* The Problem */}
      <section className={styles['problem-section']}>
        <div className="container">
          <h2>Tired of Surface-Level Dating?</h2>
          <p>
            Most dating apps left you overwhelmed by endless choices, bored by shallow profiles, and frustrated by people who aren't serious about real connections.
          </p>
          <div className={styles['problem-grid']}>
            <div className={styles['problem-card']}>
              <div className={styles['problem-card-icon']}>❌</div>
              <h3>Too Many Choices</h3>
              <p>Decision fatigue from swiping through hundreds of people</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles['problem-card-icon']}>❌</div>
              <h3>Photos First</h3>
              <p>Shallow matching that ignores personal compatibility</p>
            </div>
            <div className={styles['problem-card']}>
              <div className={styles['problem-card-icon']}>❌</div>
              <h3>No Intention</h3>
              <p>Matching with people who aren't serious about relationships</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles['how-it-works']}>
        <div className="container">
          <h2>How to Find Your Perfect Match</h2>
          <p className={styles['section-subtitle']}>
            Three simple steps to discover real compatibility
          </p>
          <div className={styles['features-grid']}>
            <FeatureCard
              icon="📝"
              title="Create Your Profile"
              description="Tell us about yourself in 2 minutes. Add photos and share your story. Real people, real profiles."
              link="/register"
            />
            <div className={styles['step-arrow']}>→</div>
            <FeatureCard
              icon="🧠"
              title="Answer Questionnaires"
              description="Complete thoughtful personality and values questionnaires. The more you share, the better we match you."
              link="/register"
            />
            <div className={styles['step-arrow']}>→</div>
            <FeatureCard
              icon="💕"
              title="Connect With Your Match"
              description="Explore compatible matches based on personality fit. Start meaningful conversations with people who actually get you."
              link="/register"
            />
          </div>
        </div>
      </section>

      {/* Why Affinity */}
      <section className={styles['why-affinity']}>
        <div className="container">
          <div className={styles['why-content']}>
            <div className={styles['why-text']}>
              <h2>Why Choose Affinity?</h2>
              <p>
                You're looking for something real. An authentic connection built on shared values, compatibility, and genuine understanding—not endless swiping. Affinity matches you on personality, values, and life goals. Better matches mean real conversations. Real conversations mean real connections.
              </p>
              <ul className={styles['why-list']}>
                <li>✓ Personality-based matching (not photo-based)</li>
                <li>✓ Verified, intention-focused community</li>
                <li>✓ Fewer matches = better quality connections</li>
                <li>✓ Your privacy is our priority</li>
                <li>✓ Join people serious about real relationships</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg">
                Find Your Match Today
              </Link>
            </div>
            <div className={styles['why-image']}>
              <img
                src="https://images.unsplash.com/photo-1552058544-f2b08422371a?w=500&h=500&fit=crop"
                alt="Happy couple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles['features-section']}>
        <div className="container">
          <h2>Premium Features</h2>
          <div className={styles['premium-grid']}>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>✨</div>
              <h3>Personality Insights</h3>
              <p>Discover what makes you compatible beyond surface level</p>
            </div>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>🎯</div>
              <h3>Smart Matching</h3>
              <p>Science-backed algorithm finds your ideal partners</p>
            </div>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>🛡️</div>
              <h3>Safe & Secure</h3>
              <p>Your privacy and safety are our top priorities</p>
            </div>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>📱</div>
              <h3>Mobile Ready</h3>
              <p>Take Affinity with you wherever you go</p>
            </div>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>💬</div>
              <h3>Real Conversations</h3>
              <p>Message and get to know your matches instantly</p>
            </div>
            <div className={styles['premium-feature']}>
              <div className={styles['feature-badge']}>🌟</div>
              <h3>Premium Boost</h3>
              <p>Increase visibility and get premium features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles['testimonials']}>
        <div className="container">
          <h2>Hear from Our Community</h2>
          <div className={styles['testimonials-grid']}>
            <TestimonialCard
              quote="I was skeptical about online dating, but Affinity showed me people who actually understand me. We've been together for 6 months now!"
              author="Sarah"
              matchedWith="Marcus"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              rating={5}
            />
            <TestimonialCard
              quote="The questionnaires were so thoughtful. Matching with someone who shares my values has been amazing. Highly recommend!"
              author="James"
              matchedWith="Elena"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              rating={5}
            />
            <TestimonialCard
              quote="Finally, a dating app that prioritizes real connections over superficial swipes. Found my girlfriend here!"
              author="Alex"
              matchedWith="Jordan"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h3>2.5M+</h3>
              <p>Active Users</p>
            </div>
            <div className={styles['stat-card']}>
              <h3>15K+</h3>
              <p>Matches Daily</p>
            </div>
            <div className={styles['stat-card']}>
              <h3>78%</h3>
              <p>Happy Couples</p>
            </div>
            <div className={styles['stat-card']}>
              <h3>4.8★</h3>
              <p>App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles['final-cta']}>
        <div className="container container-sm text-center">
          <h2>Ready to Find Your Match?</h2>
          <p>
            Join thousands of people discovering real connections through personality compatibility. Create your profile in 2 minutes—personality assessment comes after you sign up.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create My Profile
          </Link>
          <p className={styles['cta-footer']}>
            💬 No spam. No credit card required. Already a member? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles['footer-content']}>
            <div className={styles['footer-section']}>
              <h4>Affinity</h4>
              <p>Find love through intelligence</p>
            </div>
            <div className={styles['footer-section']}>
              <h4>Product</h4>
              <ul>
                <li><a href="/under-construction">How It Works</a></li>
                <li><a href="/under-construction">Safety Tips</a></li>
                <li><a href="/under-construction">Features</a></li>
              </ul>
            </div>
            <div className={styles['footer-section']}>
              <h4>Company</h4>
              <ul>
                <li><a href="/under-construction">About</a></li>
                <li><a href="/under-construction">Blog</a></li>
                <li><a href="/under-construction">Contact</a></li>
              </ul>
            </div>
            <div className={styles['footer-section']}>
              <h4>Legal</h4>
              <ul>
                <li><a href="/under-construction">Privacy Policy</a></li>
                <li><a href="/under-construction">Terms of Service</a></li>
                <li><a href="/under-construction">Safety Policy</a></li>
              </ul>
            </div>
          </div>
          <div className={styles['footer-bottom']}>
            <p>&copy; 2026 Affinity. All rights reserved. 💘</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthenticatedHome() {
  return (
    <div className={`${styles['home-page']} ${styles['authenticated-home']}`}>
      <div className="container">
        <div className={styles['welcome-banner']}>
          <h1>Welcome Back! 👋</h1>
          <p>Ready to find your perfect match?</p>
        </div>

        <div className={styles['quick-actions']}>
          <div className={styles['action-card']}>
            <h3>📋 Complete Questionnaires</h3>
            <p>The more you answer, the better your matches!</p>
            <Link to="/questionnaires" className="btn btn-primary">
              Continue
            </Link>
          </div>
          <div className={styles['action-card']}>
            <h3>💕 Discover Matches</h3>
            <p>Explore compatible singles in your area</p>
            <Link to="/discovery" className="btn btn-primary">
              Start Exploring
            </Link>
          </div>
          <div className={styles['action-card']}>
            <h3>👤 Edit Profile</h3>
            <p>Add photos and tell us more about yourself</p>
            <Link to="/profile" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>
          <div className={styles['action-card']}>
            <h3>⚙️ Set Preferences</h3>
            <p>Define what you're looking for in a match</p>
            <Link to="/preferences" className="btn btn-primary">
              Set Preferences
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
