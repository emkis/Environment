[Inglês](/README.md) | Português

<div align="center">
  <h1>Meu Terminal</h1>
  <p>Todas as configurações e plugins que utilizo para que a experiência de usar o terminal seja produtiva e deliciosa.</p>
  <img src="/.github/demonstration.gif" alt="Demonstração de interações com terminal">
  <br>
  <br>
</div>

## Terminal
Eu utilizo o [Hyper](https://hyper.is), que é um terminal baseado no Electron. Você pode ver como ele é pelo GIF mostrado no começo dessa página.

> O uso desse terminal não é obrigatório. Você pode seguir todos os passos dessa página, e usar um terminal diferente.

Para instalar o Hyper, você pode acessar o [guia de instalação](https://hyper.is/#installation), ou se você está utilizando MacOS e usa o Homebrew, execute:

```bash
brew install --cask hyper
```

As configurações que utilizo no hyper estão [neste arquivo](/hyper-configuration.js), você pode copiar e colar no seu arquivo `.hyper.js`, e tudo vai funcionar corretamente depois que a instalação acabar.

<br>

## Configurando o Shell
Shell é um interpretador de comandos do sistema operacional. O que eu costumo utilizar é o Zsh, que é um dos mais utilizados.

**Todos os passos abaixo são obrigatórios para que tudo funcione corretamente**, então leia com atenção e execute os comandos na mesma ordem.

Essas configurações só vão funcionar em sistemas baseados em Unix, assim como o MacOS e Linux. Caso você esteja no Windows, é recomendado utilizar o WSL (pesquise sobre isso para entender mais e configurar e fazer sua configuração).

<br>

## Instalando Homebrew (*apenas no MacOS*)
O [Homebrew](https://brew.sh) é um gerenciador de pacotes que te ajuda a instalar basicamente qualquer coisa. Você vai precisar dele para instalar todas as ferramentas.

Para instalar execute:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<br>

## Instalando Git
No MacOS, execute:
```bash
brew install git
```

No Linux, execute:
```bash
sudo apt-get install git -y
```

<br>

## Instalando Curl
Provavelmente você já tem o curl instalado no seu sistema, verifique com o comando `curl --version`. Caso não tenha, siga o passo abaixo.

No MacOS, execute:
```bash
brew install curl
```

No Linux, execute:
```bash
sudo apt-get install curl -y
```

<br>

## Instalando o Zsh
Se você está utilizando a última versão do MacOS, você já possuí o Zsh instalado por padrão. Você pode verificar com o comando `zsh --version`. Caso não tenha, siga o passo abaixo.

No MacOS, execute:
```bash
brew install zsh
```

No Linux, execute:
```bash
sudo apt install zsh -y
```

<br>

## Instalando Oh My Zsh
O [Oh My Zsh](https://ohmyz.sh) é um framework para o Zsh que padroniza a forma de configurar temas, plugins e etc.

No MacOS ou Linux, execute:
```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

<br>

## Instalando tema e plugins do Oh My Zsh
Abaixo está a lista com os plugins e o tema que utilizo. Sinta-se a vontade de adicionar suas próprias configurações também. 

Plugin [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Plugin [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Plugin [zsh-completions](https://github.com/zsh-users/zsh-completions)
```bash
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
```

Adicionando tema [Spaceship Zsh](https://github.com/denysdovhan/spaceship-prompt). Você pode descobrir outros temas [aqui](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes).
```bash
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

<br>

## Configurando o Zsh
Agora você precisa definir as configurações do Zsh e do tema. Para fazer isso, você precisa alterar seu arquivo `.zshrc` que está na pasta do seu perfil.

Para abrir o arquivo no VSCode, execute:
```bash
code ~/.zshrc
```

Copie o conteúdo [deste arquivo](/zshrc-configurations.txt), e cole no seu arquivo `.zshrc`. Tome cuidado e verifique se você não vai substituir algo que não queira.

A única configuração que você precisa manter, é sua variável `ZSH` que provavelmente fica no começo do arquivo. Depois de colar as configurações, mantenha somente uma configuração do `NVM`, a que seja compatível com seu sistema operacional.

Depois desses passos, tudo já deve estar pronto e funcionando perfeitamente, aproveite ✨.