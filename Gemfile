# Gemfile optimized for GitHub Pages builds
# Note: Avoid committing platform-specific Gemfile.lock from local machines.

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 6.2", ">= 6.2.3"

# No test group - let GitHub handle testing
# gem "html-proofer", "~> 4.4", group: :test

# Platform-specific gems (GitHub will choose correct ones)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]