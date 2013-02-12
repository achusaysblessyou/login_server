class User < ActiveRecord::Base
  attr_accessible :count, :password, :username
end
