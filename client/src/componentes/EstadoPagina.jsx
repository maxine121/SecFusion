function EstadoPagina({ icon: Icon, titulo, descricao }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{titulo}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{descricao}</p>
    </div>
  )
}

export default EstadoPagina
