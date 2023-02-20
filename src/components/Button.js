function Button({ number: { number, id, keytrigger, src }, handleClick }) {

    return (
      <div className='boardGame' id={id} onClick={() => handleClick(id, src)} >
        <audio  className='clip' id={keytrigger} preload='auto'>
          <source src={src} type="audio/mpeg"></source>
        </audio>
        {number}
      </div>
    )
  };
  
  export default Button;