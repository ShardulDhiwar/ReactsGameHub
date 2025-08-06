import { Link } from "react-router-dom";

const games = [
  {
    id: "snake",
    title: "🐍 Snake Game",
    route: "/snake",
    image: "/assets/snake.png?height=200&width=200",
  },
  {
    id: "tic-tac-toe",
    title: "❌⭕ Tic Tac Toe",
    route: "/tic-tac-toe",
    image: "/assets/Tic-tac-toe.jpg?height=200&width=200",
  },
  {
    id: "memory",
    title: "🧠 Memory Match",
    route: "/memory",
    image: "/assets/memory.png?height=200&width=200",
  },
];

const GameSelection = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-white">ReactGameHub 🎮</h1>
        <p className="text-gray-400 text-lg">Play 3 classic games in one place</p>
      </div>

      {/* Game Cards */}
      <div className="max-w-full sm:max-w-xl md:max-w-4xl mx-auto space-y-6 px-2 sm:px-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:bg-gray-750 border border-gray-700 hover:border-cyan-500/50 
                       flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Game Preview Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-700 shadow-lg">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors break-words">
                {game.title}
              </h3>
            </div>

            {/* Play Button */}
            <div className="flex-shrink-0">
              <Link to={game.route}>
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-md transition-all duration-300 
                             hover:shadow-cyan-500/50 hover:shadow-lg hover:scale-105 border border-blue-500 hover:border-cyan-400 hover:text-cyan-100 whitespace-nowrap"
                >
                  Play
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Styles for extra effects */}
      <style>
        {`
          .hover\\:shadow-cyan-500\\/50:hover {
            box-shadow: 0 10px 25px -3px rgba(6, 182, 212, 0.5), 0 4px 6px -2px rgba(6, 182, 212, 0.25);
          }
          .group:hover .hover\\:shadow-lg {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          }
          .bg-gray-750 {
            background-color: rgb(55, 65, 81);
          }
        `}
      </style>
    </div>
  );
};

export default GameSelection;
