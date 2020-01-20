#!/bin/sh

# Author: Chi-Huy Trinh
# Version : 2019-10-03

# N.B. Windows user should use this with GitBash

# Execute this script to mirror (to make a perfectly exact copy) from GitLab to GitHost.Poly
# You need to execute this regularly to ensure changes are reflected to GitHost.Poly
# ref. https://help.github.com/en/articles/duplicating-a-repository#mirroring-a-repository-in-another-location

#ssh : git@gitlab.com:blitzter47/projet2990.git
#https: https://gitlab.com/blitzter47/projet2990.git

ORIGINAL_URL='git@gitlab.com:blitzter47/projet2990.git'
TEAM_ID_POLY=15

MIRROR_FOLDER_NAME='gitlab_copy_refs'
already_exist_folder=false

echo -n ">>Hello, what is your \"code d'acces Moodle/Poly\"? "
read USERNAME_POLY

#while true; do
	#echo -n ">>Your team ID #? "
	#read TEAM_ID_POLY

	#if [ "$TEAM_ID_POLY" -gt 0 ] && [ "$TEAM_ID_POLY" -lt 21 ]
	#then
		#break
	#else
		#echo "Sorry, invalid number!"
	#fi
#done

root="$(git rev-parse --show-toplevel)"

if [ "$?" -ne 0 ]; then
	# we are not in git directory, so it's OK
	CURRENT_SCRIPT_PATH="$(dirname "$0")"
else
	# Danger : we are in git directory and we have to move away
	CURRENT_SCRIPT_PATH="$(dirname "$root")"
fi

cd "$CURRENT_SCRIPT_PATH"
echo '>>cd into '"$CURRENT_SCRIPT_PATH"

if [ "$?" -ne 0 ]; then
	echo "Cannot go to $CURRENT_SCRIPT_PATH folder"
	exit 1;
fi

if [ ! -d "$MIRROR_FOLDER_NAME" ]; then
	echo '>>Cloning GitLab with "mirror" mode into ./'"$MIRROR_FOLDER_NAME"
	git clone --mirror "$ORIGINAL_URL" "$MIRROR_FOLDER_NAME"
else
	already_exist_folder=true
fi

echo '>>Going to the "mirroring" folder : ./'"$MIRROR_FOLDER_NAME"
cd "$MIRROR_FOLDER_NAME"

if [ "$?" -ne 0 ]; then
	echo "Cannot go to $MIRROR_FOLDER_NAME folder"
	exit 2;
fi

echo '>>Setting "push" destination to GitHost.Poly'
git remote set-url --push origin https://"$USERNAME_POLY"@githost.gi.polymtl.ca/git/log2990-"${TEAM_ID_POLY}"

if [ "$?" -ne 0 ]; then
	exit 3;
fi

# Useful only if there are changes pushed between the time $MIRROR_FOLDER_NAME is created and now!
if [ "$already_exist_folder" = "true" ] ; then
	echo '>>Fetching updates from GitLab'
	git fetch -p origin

	if [ "$?" -ne 0 ]; then
		exit 4;
	fi
fi

echo '>>Pushing information to GitHost.Poly'
git push origin --mirror --no-verify

if [ "$?" -ne 0 ]; then
	exit 5;
fi

# prevents intefering remote with current working Git directory
#git remote remove poly

if [ "$?" -ne 0 ]; then
	echo "Cannot clear Poly's remote"
	exit 6;
fi

echo '>>Done!'