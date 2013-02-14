class User < ActiveRecord::Base
  attr_accessible :count, :password, :user

  validates :user, :uniqueness => true, :length => {:minimum => 1, :maximum => 128}
  validates :password, :length => {:maximum => 128}
  validates :count, :numericality => { :greater_than_or_equal_to => 0 }
end
