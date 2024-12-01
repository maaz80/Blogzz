import PropTypes from 'prop-types';

const Popup = ({ children }) => {
  return (
    <div className='w-full h-screen bg-black/10 flex justify-center items-center fixed top-0 left-0 backdrop-blur-sm z-50'>
      <div className="fixed z-50 text-white top-1/2 left-1/2 -translate-x-1/2 bg-rose-700 rounded-md shadow-gray-800 w-60 h-16 flex justify-center items-center shadow-md transition-all duration-150 ease-in">
      {children}
    </div>
    </div>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default Popup;
