import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, AlertTriangle, Calculator, DollarSign } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';

const articles = [
  {
    id: 'comment-eviter-frais-agence-immobiliere',
    title: 'Comment éviter les frais d\'agence immobilière avec GoAdresse',
    excerpt: 'Découvrez comment économiser jusqu\'à 8% sur votre achat immobilier en évitant les frais d\'agence grâce à GoAdresse. Achetez en direct avec le propriétaire.',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-27',
    readTime: '6 min',
    category: 'Économies'
  },
  {
    id: 'comment-bien-preparer-visite-immobiliere',
    title: 'Comment bien préparer une visite immobilière ?',
    excerpt: 'Découvrez nos conseils pratiques pour bien préparer une visite immobilière et maximiser vos chances de trouver la maison idéale.',
    image: 'https://images.pexels.com/photos/5998051/pexels-photo-5998051.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-27',
    readTime: '5 min',
    category: 'Conseils'
  },
  {
    id: 'erreurs-eviter-achat-maison',
    title: 'Les 5 erreurs à éviter quand tu achètes une maison',
    excerpt: 'Évite les pièges fréquents lors de l\'achat d\'une maison grâce à nos conseils pratiques. Découvre les 5 erreurs à ne pas commettre.',
    image: 'https://images.pexels.com/photos/7578915/pexels-photo-7578915.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-27',
    readTime: '6 min',
    category: 'Erreurs à éviter'
  },
  {
    id: 'comment-estimer-valeur-bien-immobilier',
    title: 'Comment estimer la valeur de son bien immobilier ?',
    excerpt: 'Guide complet pour estimer efficacement la valeur de votre bien immobilier. Méthodes, outils et conseils d\'experts pour une estimation réaliste.',
    image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2025-01-27',
    readTime: '7 min',
    category: 'Estimation'
  }
];

const ArticlesPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Articles</span> & Conseils
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Découvrez nos guides et conseils pour réussir votre projet immobilier, 
                de la recherche à l'achat en passant par la visite.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/articles/${article.id}`}>
                    <Card hover className="h-full overflow-hidden group">
                      <div className="relative">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-white text-xs rounded-full flex items-center ${
                            article.category === 'Erreurs à éviter' 
                              ? 'bg-red-500' 
                              : article.category === 'Estimation'
                              ? 'bg-blue-500'
                              : article.category === 'Économies'
                              ? 'bg-green-500'
                              : 'bg-primary-500'
                          }`}>
                            {article.category === 'Erreurs à éviter' && (
                              <AlertTriangle size={12} className="mr-1" />
                            )}
                            {article.category === 'Estimation' && (
                              <Calculator size={12} className="mr-1" />
                            )}
                            {article.category === 'Économies' && (
                              <DollarSign size={12} className="mr-1" />
                            )}
                            {article.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-400 mb-3">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                          <Clock size={14} className="ml-4 mr-2" />
                          <span>{article.readTime}</span>
                        </div>
                        
                        <h2 className="text-xl font-semibold mb-3 group-hover:text-primary-400 transition-colors">
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors">
                          <span className="text-sm font-medium">Lire l'article</span>
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Section vide pour les futurs articles */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
                <BookOpen size={48} className="text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Plus d'articles bientôt</h3>
                <p className="text-gray-400">
                  Nous préparons d'autres guides et conseils pour vous accompagner 
                  dans votre recherche immobilière. Restez connectés !
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticlesPage;