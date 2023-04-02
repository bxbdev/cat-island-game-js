const userInterface = document.querySelector('#userInterface')
const dialogue = document.querySelector('#dialogueBox')
const enemyHealth = document.querySelector('#enemyHealthBar')
const playerHealth = document.querySelector('#playerHealthBar')
const attacksBox = document.querySelector('#attacksBox')
// battle assets
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage,
})

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
    userInterface.style.display = 'block'
    dialogue.style.display = 'none'
    enemyHealth.style.width = '100%'
    playerHealth.style.width = '100%'
    attacksBox.replaceChildren()

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]
    queue = []

    emby.attacks.forEach( (attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        attacksBox.append(button)
    })

    const buttons = document.querySelectorAll('button')
    buttons.forEach( button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.textContent]
            emby.attack({
                attack: selectedAttack,
                recipient: draggle, 
                renderedSprites,
            })

            if (draggle.health <= 0) {
                queue.push( () => {
                    draggle.faint()
                })
                queue.push( () => {
                    gsap.to('#overlaping', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()

                            userInterface.style.display = 'none'

                            gsap.to('#overlaping', {
                                opacity: 0,
                            })

                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })

            }

            // draggle or enemy attacks right here
            const randomAttack = 
                    draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push( () => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby, 
                    renderedSprites,
                })

                if (emby.health <= 0) {
                    queue.push( () => {
                        emby.faint()
                    })

                    queue.push( () => {
                        gsap.to('#overlaping', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                userInterface.style.display = 'none'
    
                                gsap.to('#overlaping', {
                                    opacity: 0,
                                })
    
                                battle.initiated = false
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.textContent]
            const attackType = document.querySelector('#attackType')
            attackType.innerHTML = selectedAttack.type
            attackType.style.color = selectedAttack.color
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    // console.log('animating battle')
    battleBackground.draw()
    // draggle.draw()
    // emby.draw()
    renderedSprites.forEach( sprite => {
        sprite.draw()
    })

}

animate()
// initBattle()
// animateBattle()

dialogue.addEventListener('click', (e)=> {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})