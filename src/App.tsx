import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import PricingPage from './pages/Pricing/PricingPage';
import SearchPage from './pages/Search/SearchPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SuccessPage from './pages/Success/SuccessPage';
import ArticlesPage from './pages/Articles/ArticlesPage';
import ArticleVisiteImmobiliere from './pages/Articles/ArticleVisiteImmobiliere';
import ArticleErreursAchatMaison from './pages/Articles/ArticleErreursAchatMaison';
import ArticleEstimationBien from './pages/Articles/ArticleEstimationBien';
import ArticleEviterFraisAgence from './pages/Articles/ArticleEviterFraisAgence';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/comment-bien-preparer-visite-immobiliere" element={<ArticleVisiteImmobiliere />} />
          <Route path="/articles/erreurs-eviter-achat-maison" element={<ArticleErreursAchatMaison />} />
          <Route path="/articles/comment-estimer-valeur-bien-immobilier" element={<ArticleEstimationBien />} />
         <Route path="/articles/comment-eviter-frais-agence-immobiliere" element={<ArticleEviterFraisAgence />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiresAuth={true}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;