function Level( { level: { name, id }, handleClick}) {
    return (
        <div className='level' id={id} onClick={() => handleClick(name)}>{name}</div> 
    )

};

export default Level;