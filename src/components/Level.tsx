
export const Level = ({ level: { name, id }, handleClick }: { level: { name: string, id: string }, handleClick: (name: string) => void }) => {
  return (
    <div
      className='level'
      id={id}
      onClick={() => handleClick(name)}
    >
      {name}
    </div>
  )
}
