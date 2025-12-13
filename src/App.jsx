import React, { useState, useEffect } from 'react';
import { Clock, Zap, TrendingUp, CheckCircle, AlertCircle, GitPullRequest, Users, Code, Target, Calendar, BookOpen, Layers } from 'lucide-react';

const FastPass = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedPR, setSelectedPR] = useState(null);
  const [timesSaved, setTimesSaved] = useState(0);

  // Mock user expertise data (would come from analyzing past reviews)
  const userExpertise = {
    languages: { python: 95, javascript: 85, go: 70, java: 60, rust: 40 },
    areas: { auth: 90, frontend: 85, api: 80, infrastructure: 65, ml: 50 },
    avgReviewTime: {
      small: 8,    // minutes
      medium: 25,
      large: 65,
      xlarge: 120
    }
  };

  // Mock PR data (in reality, this would be fetched from GitHub/GitLab API)
  const [pullRequests] = useState([
    {
      id: 1,
      title: 'Add OAuth2 token refresh logic',
      author: 'sarah_chen',
      repo: 'auth-service',
      size: 'small',
      files: 4,
      additions: 127,
      deletions: 45,
      languages: ['python'],
      areas: ['auth', 'api'],
      age: 2, // hours
      blocking: true,
      complexity: 'low',
      tests: true,
      conflicts: false,
      authorResponseTime: 'fast', // < 2 hours
      description: 'Implements automatic token refresh for OAuth2 clients',
      similarPRs: [],
      estimatedTime: 8,
      priority: 95,
      context: {
        relatedDocs: ['OAuth2 Implementation Guide', 'Token Management Best Practices'],
        recentChanges: 'Token validation refactored 3 days ago',
        dependencies: 'None'
      }
    },
    {
      id: 2,
      title: 'Refactor user profile component with hooks',
      author: 'mike_jones',
      repo: 'frontend-app',
      size: 'medium',
      files: 8,
      additions: 340,
      deletions: 280,
      languages: ['javascript', 'typescript'],
      areas: ['frontend'],
      age: 18,
      blocking: false,
      complexity: 'medium',
      tests: true,
      conflicts: false,
      authorResponseTime: 'medium',
      description: 'Converts class components to functional components with React hooks',
      similarPRs: [3],
      estimatedTime: 22,
      priority: 82,
      context: {
        relatedDocs: ['React Hooks Migration Guide', 'Component Standards'],
        recentChanges: 'Similar refactor in dashboard component last week',
        dependencies: 'None'
      }
    },
    {
      id: 3,
      title: 'Update dashboard layout with new design system',
      author: 'emma_liu',
      repo: 'frontend-app',
      size: 'medium',
      files: 12,
      additions: 445,
      deletions: 320,
      languages: ['javascript', 'css'],
      areas: ['frontend'],
      age: 6,
      blocking: false,
      complexity: 'low',
      tests: true,
      conflicts: false,
      authorResponseTime: 'fast',
      description: 'Applies new design system tokens and layout components',
      similarPRs: [2],
      estimatedTime: 25,
      priority: 78,
      context: {
        relatedDocs: ['Design System v3.0', 'Layout Components Guide'],
        recentChanges: 'Design system updated yesterday',
        dependencies: 'Requires design-tokens v3.1'
      }
    },
    {
      id: 4,
      title: 'Implement rate limiting for API endpoints',
      author: 'david_park',
      repo: 'api-gateway',
      size: 'large',
      files: 15,
      additions: 680,
      deletions: 120,
      languages: ['go'],
      areas: ['api', 'infrastructure'],
      age: 36,
      blocking: true,
      complexity: 'high',
      tests: true,
      conflicts: true,
      authorResponseTime: 'slow',
      description: 'Adds distributed rate limiting using Redis',
      similarPRs: [],
      estimatedTime: 75,
      priority: 65,
      context: {
        relatedDocs: ['Rate Limiting Architecture', 'Redis Cluster Setup'],
        recentChanges: 'API authentication changed 2 weeks ago (potential conflict)',
        dependencies: 'Redis cluster v7.0+'
      }
    },
    {
      id: 5,
      title: 'Add telemetry for ML model inference',
      author: 'priya_sharma',
      repo: 'ml-platform',
      size: 'medium',
      files: 7,
      additions: 290,
      deletions: 45,
      languages: ['python'],
      areas: ['ml', 'infrastructure'],
      age: 12,
      blocking: false,
      complexity: 'medium',
      tests: false,
      conflicts: false,
      authorResponseTime: 'medium',
      description: 'Instruments model serving with OpenTelemetry',
      similarPRs: [],
      estimatedTime: 35,
      priority: 58,
      context: {
        relatedDocs: ['OpenTelemetry Integration', 'ML Monitoring Standards'],
        recentChanges: 'None',
        dependencies: 'opentelemetry-sdk v1.20+'
      }
    },
    {
      id: 6,
      title: 'Fix memory leak in websocket handler',
      author: 'alex_thompson',
      repo: 'realtime-service',
      size: 'small',
      files: 2,
      additions: 35,
      deletions: 18,
      languages: ['java'],
      areas: ['infrastructure'],
      age: 4,
      blocking: true,
      complexity: 'medium',
      tests: true,
      conflicts: false,
      authorResponseTime: 'fast',
      description: 'Properly closes connections and cleans up listeners',
      similarPRs: [],
      estimatedTime: 18,
      priority: 70,
      context: {
        relatedDocs: ['WebSocket Best Practices'],
        recentChanges: 'Connection pooling updated last month',
        dependencies: 'None'
      }
    }
  ]);

  // Calculate optimal review order
  const getOptimalOrder = () => {
    return [...pullRequests].sort((a, b) => b.priority - a.priority);
  };

  // Group similar PRs for batch review
  const getBatchOpportunities = () => {
    const batches = [];
    const processed = new Set();

    pullRequests.forEach(pr => {
      if (processed.has(pr.id)) return;
      
      const similar = pullRequests.filter(p => 
        p.id !== pr.id && 
        !processed.has(p.id) &&
        p.repo === pr.repo &&
        p.areas.some(area => pr.areas.includes(area))
      );

      if (similar.length > 0) {
        batches.push({
          prs: [pr, ...similar],
          totalTime: [pr, ...similar].reduce((sum, p) => sum + p.estimatedTime, 0),
          commonArea: pr.areas[0],
          repo: pr.repo
        });
        processed.add(pr.id);
        similar.forEach(p => processed.add(p.id));
      }
    });

    return batches;
  };

  const optimalOrder = getOptimalOrder();
  const batchOpportunities = getBatchOpportunities();

  // Calculate stats
  const totalPRs = pullRequests.length;
  const blockingPRs = pullRequests.filter(pr => pr.blocking).length;
  const totalEstimatedTime = pullRequests.reduce((sum, pr) => sum + pr.estimatedTime, 0);
  const optimizedTime = optimalOrder.slice(0, 3).reduce((sum, pr) => sum + pr.estimatedTime, 0);

  const getPriorityColor = (priority) => {
    if (priority >= 80) return 'from-red-500 to-orange-500';
    if (priority >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getSizeColor = (size) => {
    const colors = {
      small: 'bg-green-500',
      medium: 'bg-yellow-500',
      large: 'bg-orange-500',
      xlarge: 'bg-red-500'
    };
    return colors[size] || 'bg-gray-500';
  };

  const PRCard = ({ pr, rank }) => (
    <div 
      className={`bg-slate-800 border-2 rounded-xl p-5 hover:border-blue-400 transition-all cursor-pointer ${
        selectedPR === pr.id ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-slate-700'
      }`}
      onClick={() => setSelectedPR(selectedPR === pr.id ? null : pr.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`bg-gradient-to-r ${getPriorityColor(pr.priority)} text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0`}>
            {rank}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1">{pr.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {pr.author}
              </span>
              <span>•</span>
              <span>{pr.repo}</span>
              <span>•</span>
              <span>{pr.age}h ago</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            <span className="text-white font-semibold">{pr.estimatedTime}m</span>
          </div>
          <span className={`${getSizeColor(pr.size)} text-white text-xs px-2 py-1 rounded font-medium`}>
            {pr.size.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {pr.languages.map((lang, i) => (
          <span key={i} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700">
            {lang}
          </span>
        ))}
        {pr.blocking && (
          <span className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded border border-red-700 flex items-center gap-1">
            <AlertCircle size={12} />
            BLOCKING
          </span>
        )}
        {pr.conflicts && (
          <span className="bg-orange-900/50 text-orange-300 text-xs px-2 py-1 rounded border border-orange-700">
            Conflicts
          </span>
        )}
      </div>

      {selectedPR === pr.id && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
          <p className="text-gray-300 text-sm">{pr.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Files Changed</span>
                <span className="text-white font-medium">{pr.files}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Additions</span>
                <span className="text-green-400 font-medium">+{pr.additions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Deletions</span>
                <span className="text-red-400 font-medium">-{pr.deletions}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Complexity</span>
                <span className="text-white font-medium capitalize">{pr.complexity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tests</span>
                <span className={`font-medium ${pr.tests ? 'text-green-400' : 'text-red-400'}`}>
                  {pr.tests ? '✓ Included' : '✗ Missing'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Author Response</span>
                <span className="text-white font-medium capitalize">{pr.authorResponseTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <BookOpen size={14} className="text-blue-400" />
              Context & Resources
            </h4>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                <span className="text-gray-300 font-medium">Related Docs:</span> {pr.context.relatedDocs.join(', ')}
              </p>
              <p className="text-gray-400">
                <span className="text-gray-300 font-medium">Recent Changes:</span> {pr.context.recentChanges}
              </p>
              <p className="text-gray-400">
                <span className="text-gray-300 font-medium">Dependencies:</span> {pr.context.dependencies}
              </p>
            </div>
          </div>

          {pr.similarPRs.length > 0 && (
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
              <p className="text-purple-300 text-sm font-medium flex items-center gap-2">
                <Layers size={14} />
                Can be batched with PR #{pr.similarPRs.join(', #')} (similar area)
              </p>
            </div>
          )}

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition-all">
            Start Review →
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Zap className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-bold text-white">FastPass</h1>
          </div>
          <p className="text-purple-200 text-xl">Smart Code Review Queue Manager</p>
          <p className="text-gray-400 text-sm mt-2">Optimized for your expertise • Zero manual sorting</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <GitPullRequest size={28} />
              <span className="text-3xl font-bold">{totalPRs}</span>
            </div>
            <p className="text-blue-100 font-semibold">PRs in Queue</p>
            <p className="text-blue-200 text-sm">{blockingPRs} blocking</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock size={28} />
              <span className="text-3xl font-bold">{optimizedTime}m</span>
            </div>
            <p className="text-purple-100 font-semibold">Next 3 PRs</p>
            <p className="text-purple-200 text-sm">Estimated time</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={28} />
              <span className="text-3xl font-bold">{timesSaved}h</span>
            </div>
            <p className="text-green-100 font-semibold">Time Saved</p>
            <p className="text-green-200 text-sm">This week</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target size={28} />
              <span className="text-3xl font-bold">{batchOpportunities.length}</span>
            </div>
            <p className="text-orange-100 font-semibold">Batch Opportunities</p>
            <p className="text-orange-200 text-sm">Similar PRs</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Optimal Queue
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'batches'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Batch Reviews
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Insights
          </button>
        </div>

        {/* Optimal Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-white font-semibold mb-1">Recommended Review Order</p>
                  <p className="text-gray-300 text-sm">
                    Based on your expertise ({Object.keys(userExpertise.languages)[0]}, {Object.keys(userExpertise.areas)[0]}), 
                    blocking status, and PR age. Review top 3 now for maximum impact.
                  </p>
                </div>
              </div>
            </div>

            {optimalOrder.map((pr, idx) => (
              <PRCard key={pr.id} pr={pr} rank={idx + 1} />
            ))}
          </div>
        )}

        {/* Batch Reviews Tab */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Layers className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-white font-semibold mb-1">Batch Review Opportunities</p>
                  <p className="text-gray-300 text-sm">
                    These PRs touch similar areas. Review them together to maintain context and reduce context switching.
                  </p>
                </div>
              </div>
            </div>

            {batchOpportunities.length === 0 ? (
              <div className="bg-slate-800 rounded-xl p-8 text-center">
                <p className="text-gray-400">No batch opportunities found right now.</p>
              </div>
            ) : (
              batchOpportunities.map((batch, idx) => (
                <div key={idx} className="bg-slate-800 border-2 border-purple-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">
                        Batch #{idx + 1}: {batch.commonArea} in {batch.repo}
                      </h3>
                      <p className="text-gray-400">{batch.prs.length} PRs • ~{batch.totalTime}m total</p>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                      Review Batch
                    </button>
                  </div>
                  <div className="space-y-3">
                    {batch.prs.map(pr => (
                      <div key={pr.id} className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{pr.title}</p>
                          <p className="text-gray-400 text-sm">{pr.author} • {pr.estimatedTime}m</p>
                        </div>
                        <span className={`${getSizeColor(pr.size)} text-white text-xs px-2 py-1 rounded font-medium`}>
                          {pr.size.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">Your Review Expertise</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 mb-2">Languages</p>
                  <div className="space-y-2">
                    {Object.entries(userExpertise.languages).map(([lang, score]) => (
                      <div key={lang} className="flex items-center gap-3">
                        <span className="text-white w-24 capitalize">{lang}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-12 text-right">{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Domain Areas</p>
                  <div className="space-y-2">
                    {Object.entries(userExpertise.areas).map(([area, score]) => (
                      <div key={area} className="flex items-center gap-3">
                        <span className="text-white w-24 capitalize">{area}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-12 text-right">{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">Average Review Times</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(userExpertise.avgReviewTime).map(([size, time]) => (
                  <div key={size} className="bg-slate-900 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1 capitalize">{size}</p>
                    <p className="text-white text-2xl font-bold">{time}m</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FastPass;

