function Camera() {

  return (
    <>
    <div class="min-h-0 flex-1">
        <div class="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <button class="group relative overflow-hidden rounded-lg border bg-card text-left transition-all hover:border-primary/60 border-destructive ring-2 ring-destructive/50 animate-pulse-alert">
                <div class="relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,oklch(0.32_0.04_200)_0%,oklch(0.18_0.015_240)_60%)]">
                    <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,oklch(1_0_0/0.03)_50%)] bg-[length:100%_4px]"></div>
                    <div class="absolute inset-x-0 h-px bg-primary/40 animate-scan"></div>
                    <div class="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-primary/30" aria-hidden="true">
                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                        <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                    </svg>
                    <div class="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent px-3 py-2">
                        <div class="flex items-center gap-2">
                            <span class="relative inline-flex h-2 w-2">
                                <span class="absolute inline-flex h-full w-full rounded-full opacity-70 bg-success animate-ping"></span>
                                <span class="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                            </span>
                            <span class="text-xs font-medium text-foreground/90">Câmera 01</span>
                        </div>
                        <div class="flex items-center gap-1.5 rounded-md bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground backdrop-blur">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot h-2.5 w-2.5 text-destructive" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="1"></circle>
                            </svg>
                            "REC"
                        </div>
                    </div>
                    <div class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-background/90 to-transparent px-3 py-2">
                        <div class="flex flex-col">
                            <span class="text-xs text-muted-foreground">Setor</span>
                            <span class="text-sm font-semibold text-foreground">Entrada Principal</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2 lucide-maximize-2 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                        <path d="M15 3h6v6"></path>
                        <path d="m21 3-7 7"></path>
                        <path d="m3 21 7-7"></path>
                        <path d="M9 21H3v-6"></path>
                        </svg>
                    </div>
                    <div class="pointer-events-none absolute inset-0 border-2 border-destructive/70"></div>


                </div>
            </button>

        </div>
    </div>
    </>
  )
}

export default Camera
