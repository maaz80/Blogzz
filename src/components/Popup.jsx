import PropTypes from 'prop-types';

const Popup = ({ children }) => {
  return (
    <div className="fixed z-50 text-white top-1/2 left-1/2 -translate-x-1/2 bg-rose-700 rounded-md shadow-gray-800 w-60 h-16 flex justify-center items-center shadow-md transition-all duration-150 ease-in">
      {children}
    </div>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired, // This validates that 'children' should be a node (string, element, etc.)
};

export default Popup;
