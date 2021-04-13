import path from 'path'

const config =  {
    mode: 'development',
    entry: {
      main: path.join(__dirname, 'src', 'main.ts')
    },
    output: {
      // distディレクトリにmain.jsを吐く
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /.ts$/,
          use: 'ts-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
}

export default config
