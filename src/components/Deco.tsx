

export const Deco = ({ position, rect1, rect2 }: { position: string; rect1: string; rect2: string }) => {
  return (
    <div className={`row deco ${position}`}>
      <Rect rect={rect1} />
      <Rect rect={rect2} />
    </div>
  )
}

const Rect = ({ rect }: { rect: string }) => <div className={`rect ${rect}`}></div>
