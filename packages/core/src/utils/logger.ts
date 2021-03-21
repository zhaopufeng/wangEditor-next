


type ConsoleKeys = keyof Console

type Levels = { [key in ConsoleKeys]?: number }

type LevelsKeys = keyof Levels


/**
 * 记录器
 */
class Logger {
    private level: ConsoleKeys = 'warn'
    private levels: Levels = {}

    /**
     * 创建记录器
     */
    static create() {
        let logger: Logger

        return (): Logger => {
            return logger
                ? logger
                : logger = new Logger
        }
    }

    /**
     * 构造函数
     */
    constructor() {
        this.initLeves()
    }

    /**
     * 初始化 leves
     */
    initLeves() {
        this.addLevel('error', 1000)
        this.addLevel('warn', 2000)
        this.addLevel('log', 3000)
        this.addLevel('info', 4000)
    }

    /**
     * 打印日志
     * @param { LevelsKeys } level
     * @param { any[] } msg
     */
    log(level: LevelsKeys, ...msg: any[]) {
        const l = this.levels[level]

        if(l === undefined) {
            return new Error(`log Level: ${level} is undefined`)
        }

        const baseLevel = this.levels[this.level] || 0

        if(l <= baseLevel && console[level]) {
            console[level](...msg)
        }
    }

    /**
     * 添加等级
     * @param { LevelsKeys } level
     * @param { any[] } msg
     */
    addLevel(level: LevelsKeys, n: number) {
        this.levels[level] = n

        // if(!this[level]) {
        //     this[level] = function (...rest: any[]) {
        //         this.log.apply(this, [level, ...rest])
        //     }
        // }
    }

    // 获取
    get baseLevel() {
        return this.level
    }

    // 设置
    set baseLevel(level: ConsoleKeys) {
        this.level = level
    }
}


export type TLogger = Logger

export default Logger.create()
