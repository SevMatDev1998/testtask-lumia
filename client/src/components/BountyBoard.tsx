import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";

export const BountyBoard = () => {
  const { sessionToken, walletAddress } = useAuth();
  const { tasks, userScore, loading, error, verifyTask } = useTasks(
    sessionToken,
    walletAddress
  );

  const isTaskCompleted = (taskId: string) => {
    return userScore?.tasks.some(
      (ut) => ut.taskId === taskId && ut.verified
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bounty Board</h1>
        {userScore && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg">
            <div className="text-sm opacity-90">Your Score</div>
            <div className="text-2xl font-bold">{userScore.score} pts</div>
            <div className="text-xs opacity-75">
              {userScore.completedTasks} tasks completed
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!sessionToken && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          Connect your wallet to verify tasks and earn rewards
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
            <div
              key={task.id}
              className={`border rounded-lg p-6 transition-all ${
                completed
                  ? "bg-green-50 border-green-300"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  +{task.rewardPoints} pts
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              {completed ? (
                <div className="flex items-center justify-center bg-green-600 text-white py-2 rounded-lg">
                  Completed
                </div>
              ) : (
                <button
                  onClick={() => verifyTask(task.id)}
                  disabled={loading || !sessionToken}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    loading || !sessionToken
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify Task"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks available yet
        </div>
      )}
    </div>
  );
};
