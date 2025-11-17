type CardProps = {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div aria-label="Card container" className="rounded-2xl bg-gray-900 p-6">
      {children}
    </div>
  );
};

export default Card;
