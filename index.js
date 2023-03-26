import inquirer from 'inquirer'
import axios from 'axios'
import ora from 'ora'
import chalk from 'chalk';

console.clear()

// 创建一个 axios 实例
const request = axios.create({
    baseURL: 'https://api.chatuapi.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

const params = [
    {
        type: 'input',
        name: 'question',
        message: '提问：',
        prefix: 'ヽ(°_°)ノ'
    }
]

function nextPrompt (res) {
    if (res && res.answer) console.log(`(･_･)ノAI：` + chalk.yellow(res.answer))
    inquirer.prompt(params).then(async (answers) => {
        const { question } = answers
        const spinner = ora('AI思考中🤔').start()
        try {
            const req = {
                accessToken: 'KCD3iq69l5JOnL5LivSe05jBNRPnToWxTbzVXNmSXcC',
                prompt: question
            }
            if (res && res.conversationId) req.conversationId = res.conversationId
            const re = await request({
                url: '/chat/ask',
                method: 'post',
                timeout: 60 * 1000,
                data: req
            })
            spinner.stop()
            const { data } = re
            nextPrompt({
                conversationId: data?.data?.conversationId || '',
                answer: data?.data?.answer || ''
            })
        } catch (err) {
            spinner.stop()
            nextPrompt({
                answer: '好像超时了...'
            })
        }
    })
}

nextPrompt()
