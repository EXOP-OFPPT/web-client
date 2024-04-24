import { Outlet } from "react-router-dom";

const ExopPagesLayout: React.FC = () => {

    return (
        <div>
            <div className="pt-20">
                <Outlet />
            </div>
        </div>
    );
};

export default ExopPagesLayout;
