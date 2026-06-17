function Camera({nome, numero, url}) {

  return (
    <>
            <button class="group relative rounded-lg border bg-card text-left hover:border-red-100 border-gray-700 ring-2 ring-gray-700 animate-pulse-alert">
                <div class={"relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,oklch(0.32_0.04_200)_0%,oklch(0.18_0.015_240)_60%)]"}>
                    <div class="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent px-3 py-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs bg-black p-1 font-medium text-white text-foreground/90">Câmera {numero}</span>
                        </div>
                    </div>
                    <video className="w-full h-full" autoplay="true" muted loop>
                        <source src={url} type="video/mp4"></source>
                    </video>
                    <div class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-background/90 to-transparent px-3 py-2">
                        <div class="flex flex-col mb-2">
                            <span class="text-sm bg-black p-1 text-white font-semibold text-foreground">{nome}</span>
                        </div>
                    </div>
                </div>
            </button>
    </>
  )
}

export default Camera
