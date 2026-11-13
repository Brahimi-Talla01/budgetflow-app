interface Props {
      title: string;
}

/**
 * React 19 hoiste automatiquement <title> dans <head> : plus besoin de
 * react-helmet-async, qui ne déclare pas React 19 comme peer dependency.
 */
const PageTitle = ({ title }: Props) => {
      return <title>{`${title} | BudgetFlow`}</title>;
};

export default PageTitle;
