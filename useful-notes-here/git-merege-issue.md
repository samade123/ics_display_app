# Git merge issues
## Error "Fatal: Not possible to fast-forward, aborting"

https://stackoverflow.com/questions/13106179/error-fatal-not-possible-to-fast-forward-aborting

Disclaimer: these commands will bring changes from the remote branch into yours.

git pull --rebase. Unlike the other solution, you don't need to know the name of your destination branch.

If your upstream branch is not set, try git pull origin <branch> --rebase (credit to @Rick in the comments)

To set this option globally, use git config --global pull.rebase true (credit to @Artur Mustafin below)