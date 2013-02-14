require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "the truth" do
    assert true
  end

  test "add user" do
  	usr = User.new(:user => "Andy", :password => "password", :count => 1234)
  	retVal = User.find_by_user_and_password_and_count({:user => "Andy", :password => "password", :count => 1234})
  	assert retVal.user == "Andy" and retVal.password == "password" and retVal.count = 1234
end
