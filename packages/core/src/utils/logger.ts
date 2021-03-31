/**
 * @description 记录器
 * @author tonghan
 */

type ConsoleKeys = keyof Console
type Levels = { [key in ConsoleKeys]?: number }
type LevelsKeys = keyof Levels

/**
 * 记录器
 */
class Logger {
    [key: string]: any
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
     * 初始化 levels
     */
    public initLeves(): void {
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
    public log(level: LevelsKeys, ...msg: any[]): void {
        const l = this.levels[level]

        if(l === undefined) {
            throw new Error(`log Level: ${level} is undefined`)
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
    public addLevel(level: LevelsKeys, n: number): void {
        this.levels[level] = n

        if(!this[level]) {
            this[level] = function (...rest: any[]) {
                this.log.apply(this, [level, ...rest])
            }
        }
    }

    /**
     * 获取 level
     */
    get baseLevel(): ConsoleKeys {
        return this.level
    }

    /**
     * 设置 level
     */
    set baseLevel(level: ConsoleKeys) {
        this.level = level
    }
}


export type TLogger = Logger

export default Logger.create()
