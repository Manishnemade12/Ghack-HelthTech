import { Route, Routes } from "react-router-dom";
import GameRoom from "./GameRoom";
import TicTacToe from "./games/tic-tac-toe/TicTacToe.jsx";
import Snake from "./games/SnakeGame.jsx";
import TypingGame from "./games/TypingGame";
import SpaceType from "./games/SpaceType";

const GameRoutes = () => {
  return (
    <Routes>
      <Route index element={<GameRoom />} />
      <Route path="tic-tac-toe" element={<TicTacToe />} />
      <Route path="snake" element={<Snake />} />
      <Route path="typing-game" element={<TypingGame />} />
      <Route path="space-type-2" element={<SpaceType />} />
    </Routes>
  );
};

export default GameRoutes;
