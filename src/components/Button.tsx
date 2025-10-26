

interface NumberItem {
  number: number
  id: number
  keytrigger: string
  key: number
  src: string
}

interface ButtonProps {
  number: NumberItem
  handleClick: (id: number, src: string) => void
}

export const Button = ({ number: { number, id, keytrigger, src }, handleClick }: ButtonProps) => {
  return (
    <div
      className='btnContainer'
      id={id.toString()}
      onClick={() => handleClick(id, src)}
    >
      <audio
        className='clip'
        id={keytrigger}
        preload='auto'
      >
        <source
          src={src}
          type='audio/mpeg'
        ></source>
      </audio>
      {number}
    </div>
  )
}
