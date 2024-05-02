import React from "react";
import { Card } from "../ui/card";
type HistoryProps = {};

const History: React.FC<HistoryProps> = () => {
  return (
    <Card className="rounded-lg shadow-lg py-10">
      <div className="font-bold pb-7 px-7 uppercase">Historique</div>
      <div className="flex flex-col items-end px-7"></div>
    </Card>
  );
};

export default History;
