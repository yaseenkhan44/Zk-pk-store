import React from 'react';
import { BlogPost } from '../types';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, ChevronRight } from 'lucide-react';

interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
  onSelectPost: (p: BlogPost) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onBack, onSelectPost }) => {
  const { blogPosts } = useStore();

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog Articles</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="text-amber-800 font-bold uppercase tracking-wider">{post.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-luxury text-stone-900 leading-tight">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed italic border-l-2 border-amber-800 pl-4 py-1">
          {post.summary}
        </p>
      </header>

      {/* Featured Image */}
      <div className="aspect-16/9 bg-stone-100 rounded-3xl overflow-hidden border border-stone-200">
        <img
          src={post.image || '/images/watch-01.jpg'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Markdown / Content Body */}
      <div className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-stone-800">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={idx} className="text-xl font-bold font-luxury text-stone-900 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-stone-900 mt-4 mb-2">
                {paragraph.replace('#### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
            const listItems = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {listItems.map((item, i) => (
                  <li key={i}>{item.replace(/^[*|-]\s+/, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-stone-700 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Tags:</span>
          {post.tags.map(t => (
            <span key={t} className="text-xs px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="pt-10 border-t border-stone-200 space-y-6">
          <h3 className="text-xl font-bold font-luxury text-stone-900">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectPost(rel)}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 p-4 space-y-2 cursor-pointer transition-colors"
              >
                <span className="text-[10px] font-bold text-amber-800 uppercase">{rel.category}</span>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800">
                  {rel.title}
                </h4>
                <span className="text-[11px] text-stone-400 block pt-1">{rel.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
