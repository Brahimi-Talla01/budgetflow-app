import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface Props {
      title: string;
}

const PageTitle = ({ title }: Props) => {
      
      const location = useLocation();

      return (
            <Helmet key={location.pathname}>
                  <title>{title} | BudgetFlow</title>
            </Helmet>
      );
};

export default PageTitle;
