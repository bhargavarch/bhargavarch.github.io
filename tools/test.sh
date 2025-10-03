#!/usr/bin/env bash
#
# Build and test the site content
#
# Requirement: html-proofer, jekyll
#
# Usage: See help information

set -eu

SITE_DIR="_site"

_config="_config.yml"

_baseurl=""

help() {
  echo "Build and test the site content"
  echo
  echo "Usage:"
  echo
  echo "   bash $0 [options]"
  echo
  echo "Options:"
  echo '     -c, --config   "<config_a[,config_b[...]]>"    Specify config file(s)'
  echo "     -h, --help               Print this information."
}

read_baseurl() {
  if [[ $_config == *","* ]]; then
    # multiple config
    IFS=","
    read -ra config_array <<<"$_config"

    # reverse loop the config files
    for ((i = ${#config_array[@]} - 1; i >= 0; i--)); do
      _tmp_baseurl="$(grep '^baseurl:' "${config_array[i]}" | sed "s/.*: *//;s/['\"]//g;s/#.*//")"

      if [[ -n $_tmp_baseurl ]]; then
        _baseurl="$_tmp_baseurl"
        break
      fi
    done

  else
    # single config
    _baseurl="$(grep '^baseurl:' "$_config" | sed "s/.*: *//;s/['\"]//g;s/#.*//")"
  fi
}

main() {
  # clean up
  if [[ -d $SITE_DIR ]]; then
    rm -rf "$SITE_DIR"
  fi

  # Ensure we don't use stale vendor gems from an incompatible architecture or Ruby
  if [[ -d vendor/bundle ]]; then
    # If on Apple Silicon but vendor contains x86_64 prebuilt gems, purge
    if [[ "$(uname -m)" == "arm64" ]] && grep -q "x86_64-darwin" -r vendor/bundle 2>/dev/null; then
      echo "> Detected x86_64 prebuilt gems on arm64; removing vendor/bundle to avoid ffi/sassc errors"
      rm -rf vendor/bundle
    fi
    # If vendor folder Ruby ABI doesn't match current Ruby major.minor, purge
    if [[ -d vendor/bundle/ruby ]]; then
      current_ruby_mm="$(ruby -e 'print RUBY_VERSION.split(".")[0,2].join(".")')"
      if ! ls -1 vendor/bundle/ruby | grep -q "^${current_ruby_mm}\."; then
        echo "> Detected vendor gems for a different Ruby (${current_ruby_mm} mismatch); removing vendor/bundle"
        rm -rf vendor/bundle
      fi
    fi
  fi

  # Ensure dependencies are installed
  bundle config set path 'vendor/bundle' >/dev/null
  bundle install --without development test --jobs 4 --retry 2

  read_baseurl

  # build
  JEKYLL_ENV=production bundle exec jekyll b \
    -d "$SITE_DIR$_baseurl" -c "$_config"

  # test (optional): run htmlproofer only if installed
  if bundle show html-proofer >/dev/null 2>&1; then
    bundle exec htmlproofer "$SITE_DIR" \
      --disable-external \
      --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"
  else
    echo "> Skipping htmlproofer (gem not installed)"
  fi
}

while (($#)); do
  opt="$1"
  case $opt in
  -c | --config)
    _config="$2"
    shift
    shift
    ;;
  -h | --help)
    help
    exit 0
    ;;
  *)
    # unknown option
    help
    exit 1
    ;;
  esac
done

main
